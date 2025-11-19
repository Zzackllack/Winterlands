package de.winterlands.jinglejoin.sounds;

import de.winterlands.jinglejoin.Jinglejoin;
import net.minecraft.client.resources.sounds.Sound;
import net.minecraft.core.Holder;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.sounds.SoundEvent;
import net.neoforged.neoforge.registries.DeferredRegister;

import java.util.Random;

public class ModSounds {
    public static final DeferredRegister<SoundEvent> SOUND_EVENTS = DeferredRegister.create(BuiltInRegistries.SOUND_EVENT, Jinglejoin.MODID);
    private static final Random RANDOM = new java.util.Random();



    public static final Holder<SoundEvent> JOIN_SOUND_1 =
            SOUND_EVENTS.register("join_sound1", () ->
                    SoundEvent.createVariableRangeEvent(ResourceLocation.fromNamespaceAndPath(Jinglejoin.MODID, "join_sound1"))
            );

    public static final Holder<SoundEvent> JOIN_SOUND_2 =
            SOUND_EVENTS.register("join_sound2", () ->
            SoundEvent.createVariableRangeEvent(ResourceLocation.fromNamespaceAndPath(Jinglejoin.MODID, "join_sound2")));

    private static final Holder<SoundEvent>[] JOIN_SOUNDS = new Holder[]{
            JOIN_SOUND_1,
            JOIN_SOUND_2
    };

    public static Holder<SoundEvent> getRandomSound(){
        Holder<SoundEvent> sound = JOIN_SOUNDS[RANDOM.nextInt(JOIN_SOUNDS.length)];

        return sound;
    }
}
